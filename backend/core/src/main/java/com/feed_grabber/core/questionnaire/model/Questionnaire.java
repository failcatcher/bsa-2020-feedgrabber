package com.feed_grabber.core.questionnaire.model;

import com.feed_grabber.core.company.Company;
import com.feed_grabber.core.question.model.Question;
import com.feed_grabber.core.questionnaire2question.QuestionnaireQuestion;
import com.feed_grabber.core.request.model.Request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "questionnaires")
public class Questionnaire {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "title", nullable = false)
    private String title;

    @OneToMany(mappedBy = "questionnaire", cascade = CascadeType.ALL)
    private List<QuestionnaireQuestion> questions = new ArrayList<>();

    @OneToMany(mappedBy = "questionnaire", cascade = CascadeType.ALL)
    private List<Request> requests;

    @ManyToOne(cascade = CascadeType.REFRESH)
    private Company company;
}
