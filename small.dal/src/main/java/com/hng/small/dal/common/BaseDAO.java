package com.hng.small.dal.common;

import com.hng.small.common.core.BaseQuery;
import com.hng.small.model.dataobject.BaseDO;

import java.util.List;

/**
 * @Author gaohanna
 * @Date 2017/3/20
 */
public interface BaseDAO {

    /**
     * 保存实体信息
     * @param entity
     */
    <T extends BaseDO> void insert(T entity);

    /**
     * 更新实体信息
     * @param entity
     * @param <T>
     * @return
     */
    <T extends BaseDO> Integer update(T entity);

    /**
     * 查询总数
     * @param query
     * @param <T>
     * @return
     */
    <T extends BaseQuery> Integer count(T query);

    /**
     * 查询列表
     * @param query
     * @param <T>
     * @param <B>
     * @return
     */
    <T extends BaseDO, B extends BaseQuery> List<T> findListByQuery(B query);

    /**
     * 通过id查询实体
     * @param id
     * @param <T>
     * @return
     */
    <T extends BaseDO> T findById(Integer id);

    /**
     * 通过id删除
     * @param id
     * @return
     */
    Integer deleteById(Integer id);


}
