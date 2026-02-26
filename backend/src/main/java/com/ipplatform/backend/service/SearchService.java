package com.ipplatform.backend.service;

import com.ipplatform.backend.model.Patent;
import com.ipplatform.backend.repository.PatentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    private final PatentRepository patentRepository;

    public SearchService(PatentRepository patentRepository) {
        this.patentRepository = patentRepository;
    }

    public List<Patent> search(String keyword,
                               String inventor,
                               String assignee,
                               String jurisdiction) {

        return patentRepository.searchPatents(
                keyword,
                inventor,
                assignee,
                jurisdiction
        );
    }
}