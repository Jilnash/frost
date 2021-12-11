package com.jilnash;

import com.jilnash.model.Generation;
import com.jilnash.repository.GenerationRepository;
import com.jilnash.repository.ModelRepository;
import com.jilnash.repository.ProductGenerationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/generation")
public class GenerationController {

    @Autowired
    ModelRepository modelRepository;

    @Autowired
    GenerationRepository generationRepository;

    @Autowired
    ProductGenerationRepository productGenerationRepository;

    @GetMapping("/all")
    public List<Generation> getGenerations(@RequestParam(name = "model", required = false) String model) {

        if(model != null)
            return generationRepository.findAllByModel(modelRepository.findByName(model));

        return generationRepository.findAll();
    }

    @PostMapping("/{id}/save")
    public void saveGeneration(@PathVariable Long id,
                               @RequestParam(name = "name") String name,
                               @RequestParam(name = "parent", required = false) Long parent) {

        Generation g = null;

        if (id != -1)
            g = generationRepository.getOne(id);
        else
            g = new Generation();

        g.setName(name);
        g.setModel(modelRepository.getOne(parent));
        generationRepository.save(g);
    }

    @PostMapping("/{id}/delete")
    public void deleteGeneration(@PathVariable Long id) {

        Generation g = generationRepository.getOne(id);

        productGenerationRepository.deleteProductGenerationByGeneration(g);
        generationRepository.delete(g);
    }
}
