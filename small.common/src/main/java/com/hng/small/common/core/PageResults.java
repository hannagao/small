package com.hng.small.common.core;

import java.util.List;

/**
 * @Author gaohanna
 * @Date 2017/3/22
 */
public class PageResults<T> {

    /**
     *  成功分页结果
     * @param totalCounts
     * @param pageNo
     * @param pageSize
     * @param data
     * @param <T>
     * @return
     */
    public static <T> PageResult<T> newPageResult(Integer totalCounts, Integer pageNo, Integer pageSize, List<T> data){
        PageResult<T> pageResult = new PageResult<T>();
        pageResult.setPageNo(pageNo);
        pageResult.setPageSize(pageSize);
        pageResult.setTotalCounts(totalCounts);
        pageResult.setTotalPages(getTotalPages(totalCounts, pageSize));
        pageResult.setData(data);
        return pageResult;
    }

    /**
     * 空的分页
     * @param pageNo
     * @param pageSize
     * @param <T>
     * @return
     */
    public static <T> PageResult<T> newEmptyPageResult(Integer pageNo, Integer pageSize){
        return newPageResult(0, pageNo, pageSize, null);
    }

    /**
     * 失败分页结果
     * @param errorMessage
     * @param <T>
     * @return
     */
    public static <T> PageResult<T> newFailPageResult(String errorMessage){
        PageResult<T> pageResult = new PageResult<T>();
        pageResult.setSuccess(Boolean.FALSE);
        pageResult.setMessage(errorMessage);
        return pageResult;
    }

    /**
     * 获取总页数
     * @param totalCounts
     * @param pageSize
     * @return
     */
    public static Integer getTotalPages(Integer totalCounts, Integer pageSize){
        if (totalCounts == null || pageSize == 0){
            return 0;
        }
        return totalCounts % pageSize == 0 ? totalCounts / pageSize : (totalCounts / pageSize) + 1;
    }
}
