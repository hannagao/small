/**
 */
package com.hng.small.web.util;

import javax.servlet.http.HttpServletRequest;

/**
 * 
 */
public class HttpRequestHelper {
	
	/**
	 * 获取应用路径
	 * @param request
	 * @return
	 * @date: 2016-11-9 下午5:46:05
	 */
	public static String getWebAppBasePath(HttpServletRequest request){
		String scheme = request.getScheme();
        String serverName = request.getServerName();
        int port = request.getServerPort();
        String path = request.getContextPath();
        
        return scheme + "://" + serverName + ":" + port + path;
	}
	
	/**
	 * 同步请求
	 * 
	 * @param request
	 * @return
	 * @date: 2016-9-23 下午4:45:24
	 */
	public static boolean isSynRequest(HttpServletRequest request) {
		return !isAsynRequest(request);
	}

	/**
	 * ajax异步请求
	 * 
	 * @param request
	 * @return
	 * @date: 2016-9-23 下午4:45:36
	 */
	public static boolean isAsynRequest(HttpServletRequest request) {
		if (request.getHeader("x-requested-with") != null && request.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")) {
			return true;
		}

		return false;
	}
}
