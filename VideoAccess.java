package com.wowzatoolbox.videoaccess;

import org.bson.Document;

import java.util.List;
import java.util.Map;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import static com.mongodb.client.model.Filters.*;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.wowza.util.URLUtils;
import com.wowza.wms.application.*;
import com.wowza.wms.amf.*;
import com.wowza.wms.client.*;
import com.wowza.wms.module.*;
import com.wowza.wms.request.*;
import com.wowza.wms.stream.*;
import com.wowza.wms.rtp.model.*;
import com.wowza.wms.httpstreamer.model.*;
import com.wowza.wms.httpstreamer.cupertinostreaming.httpstreamer.*;
import com.wowza.wms.httpstreamer.smoothstreaming.httpstreamer.*;
import com.wowza.wms.httpstreamer.mpegdashstreaming.httpstreamer.*;



public class VideoAccess extends ModuleBase {

	public void doSomething(IClient client, RequestFunction function,
			AMFDataList params) {
		getLogger().info("doSomething");
		sendResult(client, params, "Hello Wowza");
	}

	public void onAppStart(IApplicationInstance appInstance) {
		String fullname = appInstance.getApplication().getName() + "/"
				+ appInstance.getName();
		getLogger().info("onAppStart: " + fullname);
		getLogger().info("hi");
	}

	public void onAppStop(IApplicationInstance appInstance) {
		String fullname = appInstance.getApplication().getName() + "/"
				+ appInstance.getName();
		getLogger().info("onAppStop: " + fullname);
	}

	public void onConnect(IClient client, RequestFunction function,
			AMFDataList params) {
		getLogger().info("onConnect: " + client.getClientId());
	}

	public void onConnectAccept(IClient client) {
		getLogger().info("onConnectAccept: " + client.getClientId());
	}

	public void onConnectReject(IClient client) {
		getLogger().info("onConnectReject: " + client.getClientId());
	}

	public void onDisconnect(IClient client) {
		getLogger().info("onDisconnect: " + client.getClientId());
	}
	
	public void onHTTPMPEGDashStreamingSessionCreate(HTTPStreamerSessionMPEGDash httpMPEGDashStreamingSession){
		
		
		String queryStr = httpMPEGDashStreamingSession.getQueryStr();
		
		
		getLogger().info("QUERYSTRING: " + queryStr);
		//Парсим запрос

		Map<String,List> queryParMap = URLUtils.parseQueryStr(queryStr, false);
	
		String queryKey = queryParMap.get("key").toString();
		//Костыыыль (формат выдаваемой строки "[string]"
		queryKey = queryKey.substring(1,queryKey.length()-1);
		//
		
		getLogger().info("key_string: " + queryKey);
	

		try{
			MongoClient mongoClient = new MongoClient("localhost");
			MongoDatabase database = mongoClient.getDatabase("mydb");
			MongoCollection<Document> collection = database.getCollection("users");
			Document user = collection.find(eq("key",queryKey)).first();
			if(!(user==null)){
				
				getLogger().info("Successful: " + user.getString("key")+"=" + queryKey);
				//Костыли
				long startTime = user.getDouble("starttime").intValue();
				long durationTime = user.getDouble("durationtime").intValue();
				
				getLogger().info("STARTTIME_USER: " + startTime);
				getLogger().info("DURATIONTIME_USER " + durationTime);
				httpMPEGDashStreamingSession.setPlayDuration(durationTime);
				httpMPEGDashStreamingSession.setPlayStart(startTime);
			}
			else{
				
				getLogger().info("Auth error");
				
				httpMPEGDashStreamingSession.rejectSession();
			}
		
			mongoClient.close();
		}
		catch(Exception e){
			getLogger().info("Exception:"+ e);
			httpMPEGDashStreamingSession.rejectSession();
		}
		
		

		

		getLogger().info("PlayDuration: "+ httpMPEGDashStreamingSession.getPlayDuration());
		getLogger().info("PlayStart: "+ httpMPEGDashStreamingSession.getPlayStart());
	}

}