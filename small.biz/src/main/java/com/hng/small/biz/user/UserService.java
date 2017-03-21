package com.hng.small.biz.user;

import com.hng.small.dal.query.UserQuery;
import com.hng.small.model.dataobject.User;

import java.util.List;

/**
 * @Author gaohanna
 * @Date 2017/3/10
 */
public interface UserService {

    /**
     * 通过id查询
     * @param id
     * @return
     */
    User findById(Integer id);

    /**
     * 新增实体
     * @param user
     */
    void addUser(User user);

    /**
     * 列表
     * @param query
     * @return
     */
    List<User> findList(UserQuery query);

}
