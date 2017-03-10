package com.hng.small.dal.user;

import com.hng.small.common.MyBatisRepository;
import com.hng.small.model.dataobject.User;

/**
 * @Author gaohanna
 * @Date 2017/3/10
 */
@MyBatisRepository
public interface UserDAO {
    User findUserById(int id); //查询
    void addUser(User user); //添加
}
