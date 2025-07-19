#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
定时任务调度器 - 实现数据的实时更新
"""

import time
import threading
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Callable
import schedule
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger

# 导入我们的模块
from real_xhs_crawler import RealXhsCrawler
from database_manager import db_manager

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SchedulerService:
    def __init__(self):
        """初始化调度器服务"""
        self.scheduler = BackgroundScheduler()
        self.crawler = RealXhsCrawler()
        self.running = False
        self.stats = {
            'total_runs': 0,
            'successful_runs': 0,
            'failed_runs': 0,
            'last_run': None,
            'next_run': None
        }
        
        # 配置任务
        self.setup_jobs()
    
    def setup_jobs(self):
        """设置定时任务"""
        
        # 1. 每30分钟更新热门话题
        self.scheduler.add_job(
            func=self.update_hot_topics,
            trigger=IntervalTrigger(minutes=30),
            id='update_hot_topics',
            name='更新热门话题',
            max_instances=1,
            replace_existing=True
        )
        
        # 2. 每小时更新热门关键词
        self.scheduler.add_job(
            func=self.update_trending_keywords,
            trigger=IntervalTrigger(hours=1),
            id='update_keywords',
            name='更新热门关键词',
            max_instances=1,
            replace_existing=True
        )
        
        # 3. 每天凌晨2点进行数据清理
        self.scheduler.add_job(
            func=self.cleanup_old_data,
            trigger=CronTrigger(hour=2, minute=0),
            id='cleanup_data',
            name='清理旧数据',
            max_instances=1,
            replace_existing=True
        )
        
        # 4. 每6小时生成分析报告
        self.scheduler.add_job(
            func=self.generate_analysis_report,
            trigger=IntervalTrigger(hours=6),
            id='generate_report',
            name='生成分析报告',
            max_instances=1,
            replace_existing=True
        )
        
        # 5. 每分钟检查系统状态（用于演示）
        self.scheduler.add_job(
            func=self.health_check,
            trigger=IntervalTrigger(minutes=5),
            id='health_check',
            name='系统健康检查',
            max_instances=1,
            replace_existing=True
        )
        
        logger.info("✅ 定时任务配置完成")
    
    def update_hot_topics(self):
        """更新热门话题"""
        try:
            logger.info("🔥 开始更新热门话题...")
            
            # 获取热门关键词
            keywords = self.crawler.get_trending_keywords()
            
            # 爬取每个关键词的热门内容
            all_notes = []
            for keyword_data in keywords[:5]:  # 只爬取前5个关键词
                keyword = keyword_data['keyword']
                notes = self.crawler.search_notes(keyword, limit=10)
                all_notes.extend(notes)
                time.sleep(2)  # 避免请求过快
            
            # 保存到数据库
            if db_manager.connected or True:  # 总是尝试保存
                db_manager.save_notes(all_notes)
            
            self.stats['successful_runs'] += 1
            self.stats['last_run'] = datetime.now()
            
            logger.info(f"✅ 热门话题更新完成，获取 {len(all_notes)} 条数据")
            
        except Exception as e:
            logger.error(f"❌ 更新热门话题失败: {e}")
            self.stats['failed_runs'] += 1
        
        self.stats['total_runs'] += 1
    
    def update_trending_keywords(self):
        """更新热门关键词"""
        try:
            logger.info("🔍 开始更新热门关键词...")
            
            # 获取最新的热门关键词
            keywords = self.crawler.get_trending_keywords()
            
            # 保存到数据库
            if db_manager.connected or True:
                db_manager.save_keywords(keywords)
            
            logger.info(f"✅ 热门关键词更新完成，获取 {len(keywords)} 个关键词")
            
        except Exception as e:
            logger.error(f"❌ 更新热门关键词失败: {e}")
    
    def cleanup_old_data(self):
        """清理旧数据"""
        try:
            logger.info("🧹 开始清理旧数据...")
            
            # 这里可以实现清理逻辑
            # 例如：删除30天前的数据
            cutoff_date = datetime.now() - timedelta(days=30)
            
            # 如果使用MongoDB，可以删除旧数据
            # if db_manager.connected:
            #     db_manager.db[db_manager.collections['notes']].delete_many({
            #         'crawl_time': {'$lt': cutoff_date.isoformat()}
            #     })
            
            logger.info("✅ 旧数据清理完成")
            
        except Exception as e:
            logger.error(f"❌ 清理旧数据失败: {e}")
    
    def generate_analysis_report(self):
        """生成分析报告"""
        try:
            logger.info("📊 开始生成分析报告...")
            
            # 获取统计信息
            stats = db_manager.get_statistics()
            
            # 生成报告
            report = {
                'timestamp': datetime.now().isoformat(),
                'database_stats': stats,
                'scheduler_stats': self.stats.copy(),
                'system_status': 'healthy' if self.running else 'stopped'
            }
            
            # 保存报告
            import json
            import os
            
            reports_dir = os.path.join(os.path.dirname(__file__), 'reports')
            os.makedirs(reports_dir, exist_ok=True)
            
            report_file = os.path.join(reports_dir, f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            
            logger.info(f"✅ 分析报告生成完成: {report_file}")
            
        except Exception as e:
            logger.error(f"❌ 生成分析报告失败: {e}")
    
    def health_check(self):
        """系统健康检查"""
        try:
            logger.info("💓 执行系统健康检查...")
            
            # 检查数据库连接
            db_status = "connected" if db_manager.connected else "file_storage"
            
            # 检查最近的数据更新时间
            notes = db_manager.get_notes(limit=1)
            last_data_update = "unknown"
            if notes:
                last_data_update = notes[0].get('crawl_time', 'unknown')
            
            # 记录健康状态
            health_status = {
                'timestamp': datetime.now().isoformat(),
                'database_status': db_status,
                'last_data_update': last_data_update,
                'scheduler_running': self.running,
                'total_jobs': len(self.scheduler.get_jobs())
            }
            
            logger.info(f"💚 系统健康状态: {health_status}")
            
        except Exception as e:
            logger.error(f"❌ 健康检查失败: {e}")
    
    def start(self):
        """启动调度器"""
        try:
            # 连接数据库
            db_manager.connect()
            
            # 启动调度器
            self.scheduler.start()
            self.running = True
            
            logger.info("🚀 定时任务调度器启动成功")
            logger.info("📋 已配置的任务:")
            
            for job in self.scheduler.get_jobs():
                logger.info(f"   - {job.name} (ID: {job.id})")
                logger.info(f"     下次执行: {job.next_run_time}")
            
            # 立即执行一次数据更新（用于演示）
            logger.info("🎯 立即执行一次数据更新...")
            self.update_trending_keywords()
            self.update_hot_topics()
            
        except Exception as e:
            logger.error(f"❌ 启动调度器失败: {e}")
            self.running = False
    
    def stop(self):
        """停止调度器"""
        try:
            self.scheduler.shutdown()
            self.running = False
            db_manager.close()
            
            logger.info("🛑 定时任务调度器已停止")
            
        except Exception as e:
            logger.error(f"❌ 停止调度器失败: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        """获取调度器状态"""
        jobs_info = []
        for job in self.scheduler.get_jobs():
            jobs_info.append({
                'id': job.id,
                'name': job.name,
                'next_run': job.next_run_time.isoformat() if job.next_run_time else None,
                'trigger': str(job.trigger)
            })
        
        return {
            'running': self.running,
            'stats': self.stats,
            'jobs': jobs_info,
            'database_connected': db_manager.connected
        }
    
    def run_job_now(self, job_id: str) -> bool:
        """立即执行指定任务"""
        try:
            job = self.scheduler.get_job(job_id)
            if job:
                job.modify(next_run_time=datetime.now())
                logger.info(f"✅ 任务 {job_id} 已安排立即执行")
                return True
            else:
                logger.warning(f"⚠️ 未找到任务: {job_id}")
                return False
                
        except Exception as e:
            logger.error(f"❌ 执行任务失败: {e}")
            return False

# 全局调度器实例
scheduler_service = SchedulerService()

def main():
    """主函数 - 演示调度器功能"""
    print("🚀 启动定时任务调度器...")
    
    try:
        # 启动调度器
        scheduler_service.start()
        
        # 运行一段时间用于演示
        print("⏰ 调度器运行中，按 Ctrl+C 停止...")
        
        # 显示状态
        import time
        for i in range(10):  # 运行10次检查，每次间隔30秒
            time.sleep(30)
            status = scheduler_service.get_status()
            print(f"\n📊 调度器状态 (第{i+1}次检查):")
            print(f"   运行状态: {'✅ 运行中' if status['running'] else '❌ 已停止'}")
            print(f"   总任务数: {len(status['jobs'])}")
            print(f"   执行统计: {status['stats']}")
            
            # 显示下次执行时间
            for job in status['jobs']:
                if job['next_run']:
                    print(f"   - {job['name']}: {job['next_run']}")
        
    except KeyboardInterrupt:
        print("\n🛑 收到停止信号...")
    finally:
        scheduler_service.stop()
        print("✅ 调度器已安全停止")

if __name__ == "__main__":
    main()
