package com.hng.small.common.core;


import java.util.ArrayList;
import java.util.List;

/**
 * @Author gaohanna
 * @Date 2017/3/20
 */
public class Sorts {

    public static List<Sort> newDefaultSorts(){
        List<Sort> sorts = new ArrayList<Sort>();
        sorts.add(new Sort("create_time", Sort.SortType.DESC));
        return sorts;
    }

    public static List<Sort> newDefaultSortsAsc(){
        List<Sort> sorts = new ArrayList<Sort>();
        sorts.add(new Sort("create_time", Sort.SortType.ASC));
        return sorts;
    }

}
