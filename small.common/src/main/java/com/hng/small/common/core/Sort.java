package com.hng.small.common.core;

/**
 * @Author gaohanna
 * @Date 2017/3/20
 */
public class Sort {

    //列名
    private String columnName;

    //排序类型
    private String sortType;

    public Sort(){

    }

    public Sort(String columnName, SortType sortType) {
        this.columnName = columnName;
        this.sortType = sortType.getName();
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getSortType() {
        return sortType;
    }

    public void setSortType(String sortType) {
        this.sortType = sortType;
    }

    public enum SortType{

        DESC("desc"), ASC("asc");

        private String name;

        private SortType(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

}
