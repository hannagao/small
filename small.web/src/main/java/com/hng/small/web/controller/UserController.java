package com.hng.small.web.controller;

import com.hng.small.biz.user.UserService;
import com.hng.small.common.core.PageResult;
import com.hng.small.dal.query.UserQuery;
import com.hng.small.model.dataobject.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * @Author gaohanna
 * @Date 2017/3/10
 */
@Controller
public class UserController {

    @Resource
    private UserService userService;

    @RequestMapping(value = "user/userList", method = RequestMethod.GET)
    public String userList(){
        return "user/userList";
    }

    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    public String index( User user) {
        return "common/index";
    }

    @RequestMapping(value ="/toJson",method=RequestMethod.POST)
    @ResponseBody
    public User toJson(User user){
        userService.addUser(user);
        return userService.findById(2);
    }

    /**
     * 查询列表
     * @param userQuery
     * @return
     */
    @RequestMapping(value = "user/pageList", method = RequestMethod.POST)
    @ResponseBody
    public PageResult<User> pageList(UserQuery userQuery){
        return userService.findList(userQuery);
    }
}
