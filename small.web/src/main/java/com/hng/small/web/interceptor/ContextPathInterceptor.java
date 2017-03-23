package com.hng.small.web.interceptor;

import com.hng.small.web.util.HttpRequestHelper;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @Author gaohanna
 * @Date 2017/3/23
 */
public class ContextPathInterceptor extends HandlerInterceptorAdapter {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        request.setAttribute("basePath", HttpRequestHelper.getWebAppBasePath(request));
        return super.preHandle(request, response, handler);
    }
}
