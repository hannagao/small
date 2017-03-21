package com.hng.small.dal.common;

import java.lang.annotation.*;

import org.springframework.stereotype.Component;

/**
 * @Author gaohanna
 * @Date 2017/3/3
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Component
public @interface MyBatisRepository {
    String value() default "";
}
