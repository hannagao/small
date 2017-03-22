package com.hng.small.common.core;

import java.util.List;

/**
 * @Author gaohanna
 * @Date 2017/3/22
 */
public class PageResult<T> {

    private Boolean success = Boolean.TRUE;
    private Integer pageNo;
    private Integer pageSize;
    private Integer totalCounts;
    private Integer totalPages;
    private List<T> data;
    private String message;

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public Integer getPageNo() {
        return pageNo;
    }

    public void setPageNo(Integer pageNo) {
        this.pageNo = pageNo;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getTotalCounts() {
        return totalCounts;
    }

    public void setTotalCounts(Integer totalCounts) {
        this.totalCounts = totalCounts;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "PageResult{" +
                "success=" + success +
                ", pageNo=" + pageNo +
                ", pageSize=" + pageSize +
                ", totalCounts=" + totalCounts +
                ", totalPages=" + totalPages +
                ", data=" + data +
                ", message='" + message + '\'' +
                '}';
    }
}
