package com.jilnash.controller;

import com.jilnash.model.Status;
import com.jilnash.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/status")
public class StatusController {

    @Autowired
    StatusRepository statusRepository;

    @GetMapping("/all")
    public List<Status> getStatuses() {

        return statusRepository.findAll();
    }
}
