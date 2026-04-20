#!/usr/bin/env node
/**
 * EMAS 智能分析工具
 *
 * 基于阿里云 EMAS 平台的应用性能分析工具
 * 支持：崩溃分析、卡顿分析、异常分析、自定义异常分析
 * 结合 Git 获取最新相关开发者信息
 *
 * 使用方式:
 *   emas-analyze crash                    # 崩溃分析（最近7天）
 *   emas-analyze crash --days 14         # 最近14天
 *   emas-analyze crash --start 2026-04-01 --end 2026-04-17  # 自定义时间
 *   emas-analyze crash --page 1 --page-size 20  # 第1页，每页20条
 *   emas-analyze crash --page 2           # 第2页（继承上次page-size）
 *   emas-analyze crash --page 3 --page-size 50  # 第3页，每页50条
 *   emas-analyze crash --format analysis   # 智能分析（含Git开发者信息）
 *
 * 参考文档:
 *   阿里云 CLI 调用 RPC API 和 ROA API: https://help.aliyun.com/zh/cli/call-rpc-api-and-roa-api
 */
/**
 * 获取日期范围
 * @param days 最近天数
 * @param startDate 自定义开始日期
 * @param endDate 自定义结束日期
 */
declare function getDateRange(days?: number, startDate?: string, endDate?: string): {
    start: string;
    end: string;
};
/**
 * 格式化日期显示
 */
declare function formatDateRange(days?: number, startDate?: string, endDate?: string): string;
declare const ANALYSIS_TYPES: Record<string, {
    name: string;
    module: string;
    description: string;
}>;
export { getDateRange, formatDateRange, ANALYSIS_TYPES };
