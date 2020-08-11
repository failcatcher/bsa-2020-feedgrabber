package com.feed_grabber.core.question.dto;

import com.feed_grabber.core.question.QuestionType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class QuestionDto {
    UUID id;
    String text;
    String categoryTitle;
    String questionnaireTitle;
    QuestionType type;
}
