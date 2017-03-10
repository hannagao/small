package com.hng.small.biz.user;

import com.hng.small.model.dataobject.User;

/**
 * @Author gaohanna
 * @Date 2017/3/10
 */
public interface UserService {
    public User findUserById(int id);
    public void addUser(User user);
}
