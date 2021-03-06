package com.feed_grabber.core.questionnaire.dto;

import lombok.Value;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Value
public class QuestionnaireUpdateDto {
    @NotNull
    UUID id;
    @NotBlank
    String title;
    boolean archived;
}
