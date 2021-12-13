package com.jilnash.controller;

import com.jilnash.model.Type;
import com.jilnash.repository.GenerationRepository;
import com.jilnash.repository.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/type")
public class TypeController {

    @Autowired
    TypeRepository typeRepository;

    @Autowired
    GenerationRepository generationRepository;

    @PostMapping("/{id}/delete")
    public void deleteType(@PathVariable Long id) {

        Type t = typeRepository.getOne(id);

        typeRepository.delete(t);
    }

    @PostMapping("/{id}/save")
    public void saveType(@PathVariable Long id,
                         @RequestParam(name = "name") String name,
                         @RequestParam(name = "parent", required = false) Long parent) {

        Type t = null;

        if (id != -1)
            t = typeRepository.getOne(id);
        else
            t = new Type();

        t.setName(name);
        t.setGeneration(generationRepository.getOne(parent));
        typeRepository.save(t);
    }
}
