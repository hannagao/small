package com.hng.small.web.util;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 *@author fanghuaichang @date 2016-2-26 下午3:29:28
 */
public class HttpResponseHelper {

	private final static Logger logger = LoggerFactory.getLogger(HttpResponseHelper.class);
	
	/**
	 * 
	 * @param str
	 * @param response
	 */
	public static void write(String str, HttpServletResponse response){
		if (response == null){
			throw new NullPointerException("HttpServletResponse should not be null!");
		}
		response.setContentType("application/json;charset=UTF-8");
		PrintWriter writer = null;
		try {
			writer = response.getWriter();
			writer.write(str);
		} catch (IOException e) {
			logger.error("HttpServletResponse write str error!", e);
		} finally{
			if (writer != null){
				writer.close();
			}
		}
	}
}
