package com.hng.small.biz.user.impl;

import com.hng.small.biz.user.UserService;
import com.hng.small.common.core.Page;
import com.hng.small.common.core.PageResult;
import com.hng.small.common.core.PageResults;
import com.hng.small.common.core.Pages;
import com.hng.small.dal.query.UserQuery;
import com.hng.small.dal.user.UserDAO;
import com.hng.small.model.dataobject.User;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author gaohanna
 * @Date 2017/3/10
 */
@Service
public class UserServiceImpl implements UserService {

    @Resource
    private UserDAO userDAO;

    public User findById(Integer id) {
        return userDAO.findById(id);
    }

    public void addUser(User user) {
        userDAO.insert(user);
    }

    /**
     * 列表
     * @param query
     * @return
     */
    public PageResult<User> findList(UserQuery query) {
        Integer count = userDAO.count(query);
        Page page = query.getPage() == null ? Pages.newDefaultPage() : query.getPage();
        if (count == null || count == 0){
            return PageResults.newEmptyPageResult(page.getNumber(), page.getSize());
        }
        List<User> sourceList = userDAO.findListByQuery(query);
        return PageResults.newPageResult(count, page.getNumber(), page.getSize(), sourceList);
    }
}
