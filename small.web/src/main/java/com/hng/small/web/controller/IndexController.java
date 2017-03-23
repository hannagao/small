package com.hng.small.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * @Author gaohanna
 * @Date 2017/3/23
 */
@Controller
public class IndexController {

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String index(HttpServletRequest request){
        return "common/index";
    }
}
