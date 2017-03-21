package com.hng.small.model.dataobject;

import com.hng.small.model.common.SystemConstants;

import java.util.Date;

/**
 * @Author gaohanna
 * @Date 2017/3/20
 */
public abstract class BaseDO {
    private Integer id;
    private String createPerson = SystemConstants.CREATE_PERSON;
    private String updatePerson = SystemConstants.UPDATE_PERSON;
    private Date createTime;
    private Date updateTime;

    public BaseDO(){

    }
    public BaseDO(Integer id, String createPerson, String updatePerson, Date createTime, Date updateTime){
        this.id = id;
        this.createPerson = createPerson;
        this.updatePerson = updatePerson;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCreatePerson() {
        return createPerson;
    }

    public void setCreatePerson(String createPerson) {
        this.createPerson = createPerson;
    }

    public String getUpdatePerson() {
        return updatePerson;
    }

    public void setUpdatePerson(String updatePerson) {
        this.updatePerson = updatePerson;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    @Override
    public String toString() {
        return "BaseDO{" +
                "id=" + id +
                ", createPerson='" + createPerson + '\'' +
                ", updatePerson='" + updatePerson + '\'' +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                '}';
    }
}
