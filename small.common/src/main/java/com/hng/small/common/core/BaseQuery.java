package com.hng.small.common.core;


import java.util.List;

/**
 * @Author gaohanna
 * @Date 2017/3/20
 */
public class BaseQuery {

    private Integer id;

    private Page page;

    private List<Sort> sorts = Sorts.newDefaultSorts();

    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }

    public List<Sort> getSorts() {
        return sorts;
    }

    public void setSorts(List<Sort> sorts) {
        this.sorts = sorts;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
