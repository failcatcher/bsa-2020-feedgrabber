package com.feed_grabber.core.request;

import com.feed_grabber.core.auth.security.TokenService;
import com.feed_grabber.core.questionCategory.exceptions.QuestionCategoryNotFoundException;
import com.feed_grabber.core.request.dto.CreateRequestDto;
import com.feed_grabber.core.apiContract.AppResponse;
<<<<<<< HEAD
import com.feed_grabber.core.request.dto.PendingRequestDto;
=======
import com.feed_grabber.core.request.dto.RequestQuestionnaireDto;
>>>>>>> fcd73f1f836a94ccdcc55a9caada317036c2a556
import com.feed_grabber.core.user.exceptions.UserNotFoundException;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

<<<<<<< HEAD
=======
import java.security.Principal;
>>>>>>> fcd73f1f836a94ccdcc55a9caada317036c2a556
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/request")
public class RequestController {
    @Autowired
    RequestService requestService;

    @PostMapping("/new")
    @ResponseStatus(HttpStatus.OK)
    public AppResponse<UUID> createNewRequest(@RequestBody CreateRequestDto dto)
            throws UserNotFoundException, QuestionCategoryNotFoundException {
        return new AppResponse<>(requestService.createNew(dto));
    }

    @GetMapping("/pending")
    @ResponseStatus(HttpStatus.OK)
    public AppResponse<List<PendingRequestDto>> getPending() {
        return new AppResponse<>(requestService.getPending(TokenService.getUserId()));
    }

    // @ApiOperation("Get all respondent`s requests with questionnaires")
    // @GetMapping("/respondent")
    // @ResponseStatus(HttpStatus.OK)
    // public AppResponse<List<RequestQuestionnaireDto>> getAllByRespondentId(Principal principal) {
    //     return new AppResponse<>(
    //             requestService.getAllByUserId(UUID.fromString(principal.getName()))
    //     );
    // }
}
