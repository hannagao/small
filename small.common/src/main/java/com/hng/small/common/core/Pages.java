package com.hng.small.common.core;

/**
 * @Author gaohanna
 * @Date 2017/3/22
 */
public class Pages {

    private static final Integer DEFAULT_NUMBER = 1;
    private static final Integer DEFAULT_SIZE = 20;

    public static Integer getTotalPages(Integer totalCount, Integer pageSize){
        if (totalCount == null || pageSize == null){
            throw new NullPointerException("totalCount or pageSize is null!");
        }
        return totalCount % pageSize == 0 ? totalCount / pageSize : (totalCount / pageSize) + 1;
    }

    public static Page newPage(Integer number, Integer size){
        if (number == null || size == null){
            return newDefaultPage();
        }
        return new Page(number, size);
    }

    public static Page newDefaultPage(){
        return new Page(DEFAULT_NUMBER, DEFAULT_SIZE);
    }
}
