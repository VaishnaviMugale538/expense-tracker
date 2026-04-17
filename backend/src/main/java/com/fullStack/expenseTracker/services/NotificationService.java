package com.fullStack.expenseTracker.services;

import com.fullStack.expenseTracker.models.User;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface NotificationService {

    void sendUserRegistrationVerificationEmail(User user) throws MessagingException, UnsupportedEncodingException;

    void sendForgotPasswordVerificationEmail(User user) throws MessagingException, UnsupportedEncodingException;

}
