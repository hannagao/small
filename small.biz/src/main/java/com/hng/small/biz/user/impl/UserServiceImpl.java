package com.hng.small.biz.user.impl;

import com.hng.small.biz.user.UserService;
import com.hng.small.dal.user.UserDAO;
import com.hng.small.model.dataobject.User;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @Author gaohanna
 * @Date 2017/3/10
 */
@Service
public class UserServiceImpl implements UserService {

    @Resource
    private UserDAO userDAO;

    public User findUserById(int id) {
        return userDAO.findUserById(id);
    }

    public void addUser(User user) {
        userDAO.addUser(user);
    }
}
