package com.fullStack.expenseTracker.services.impls;

import com.fullStack.expenseTracker.services.NotificationService;
import com.fullStack.expenseTracker.models.User;

// @Component
public class EmailNotificationService implements NotificationService {

    @Override
    public void sendUserRegistrationVerificationEmail(User user) {
        // email disabled
    }

    @Override
    public void sendForgotPasswordVerificationEmail(User user) {
        // email disabled
    }
}