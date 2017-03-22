package com.hng.small.common.core;


/**
 * @Author gaohanna
 * @Date 2017/3/20
 */
public class Page {

    //第几页
    private Integer number;

    //页大小
    private Integer size;

    public Page(){
    }

    public Page(Integer number, Integer size){
        this.number = number;
        this.size = size;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Integer getOffset(){
        return number <= 1 ? 0 : (number - 1) * size;
    }
}
