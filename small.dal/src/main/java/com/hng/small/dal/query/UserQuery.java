package com.hng.small.dal.query;

import com.hng.small.common.core.BaseQuery;

/**
 * @Author gaohanna
 * @Date 2017/3/21
 */
public class UserQuery extends BaseQuery {

    private String userName;
    private String password;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
