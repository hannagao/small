package com.hng.small.model.dataobject;

/**
 * @Author gaohanna
 * @Date 2017/3/10
 */
public class User extends BaseDO{

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
