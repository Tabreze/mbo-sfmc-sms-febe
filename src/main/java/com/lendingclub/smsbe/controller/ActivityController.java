package com.lendingclub.smsbe.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
//@RequestMapping("/activity")
public class ActivityController {
	@CrossOrigin
    @PostMapping("/save")
    public ResponseEntity<String> save (@RequestBody Map<String, Object> payload) {
        return new ResponseEntity<>("Save", HttpStatus.OK);
    }
	@CrossOrigin
    @PostMapping("/publish")
    public ResponseEntity<String> publish (@RequestBody Map<String, Object> payload) {
        return new ResponseEntity<>("Publish", HttpStatus.OK);
    }
	@CrossOrigin
    @PostMapping("/validate")
    public ResponseEntity<String> validate (@RequestBody Map<String, Object> payload) {
        return new ResponseEntity<>("Validate", HttpStatus.OK);
    }
	@CrossOrigin
    @PostMapping("/stop")
    public ResponseEntity<String> stop (@RequestBody Map<String, Object> payload) {
        return new ResponseEntity<>("Stop", HttpStatus.OK);
    }
	@CrossOrigin
    @PostMapping("/execute")
    public ActivityResult execute (@RequestBody ExecutePayload payload) {
        for (Map<String, String> inArgument : payload.getInArguments()) {
            if(inArgument.containsKey("status") && inArgument.get("status").equals("true")){
                return new ActivityResult("true");
            }
        }
        return new ActivityResult("false");
    }
}
