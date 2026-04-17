package com.fullStack.expenseTracker.services.impls;

import com.fullStack.expenseTracker.dto.reponses.ApiResponseDto;
import com.fullStack.expenseTracker.enums.ApiResponseStatus;
import com.fullStack.expenseTracker.dto.requests.ResetPasswordRequestDto;
import com.fullStack.expenseTracker.dto.requests.SignUpRequestDto;
import com.fullStack.expenseTracker.exceptions.*;
import com.fullStack.expenseTracker.factories.RoleFactory;
import com.fullStack.expenseTracker.models.Role;
import com.fullStack.expenseTracker.models.User;
import com.fullStack.expenseTracker.repository.UserRepository;
import com.fullStack.expenseTracker.services.AuthService;
import com.fullStack.expenseTracker.services.UserService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@Slf4j
public class AuthServiceImpl implements AuthService {

    @Autowired
    UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    RoleFactory roleFactory;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ========================= SIGNUP =========================
    @Override
    public ResponseEntity<ApiResponseDto<?>> save(SignUpRequestDto signUpRequestDto)
            throws UserAlreadyExistsException, UserServiceLogicException {

        if (userService.existsByUsername(signUpRequestDto.getUserName())) {
            throw new UserAlreadyExistsException("Username already taken!");
        }

        if (userService.existsByEmail(signUpRequestDto.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered!");
        }

        try {
            User user = createUser(signUpRequestDto);
            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new ApiResponseDto<>(
                            ApiResponseStatus.SUCCESS,
                            HttpStatus.CREATED,
                            "User registered successfully!"
                    )
            );

        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            throw new UserServiceLogicException("Registration failed!");
        }
    }

    // ========================= RESET PASSWORD =========================
    @Override
    public ResponseEntity<ApiResponseDto<?>> resetPassword(ResetPasswordRequestDto dto)
            throws UserNotFoundException {

        User user = userService.findByEmail(dto.getEmail());

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        ApiResponseStatus.SUCCESS,
                        HttpStatus.OK,
                        "Password reset successful!"
                )
        );
    }

    // ========================= UNUSED METHODS (TEMP DISABLED) =========================

    @Override
    public ResponseEntity<ApiResponseDto<?>> verifyRegistrationVerification(String code) {
        throw new UnsupportedOperationException("Email verification disabled");
    }

    @Override
    public ResponseEntity<ApiResponseDto<?>> resendVerificationCode(String email) {
        throw new UnsupportedOperationException("Email verification disabled");
    }

    @Override
    public ResponseEntity<ApiResponseDto<?>> verifyEmailAndSendForgotPasswordVerificationEmail(String email) {
        throw new UnsupportedOperationException("Email verification disabled");
    }

    @Override
    public ResponseEntity<ApiResponseDto<?>> verifyForgotPasswordVerification(String code) {
        throw new UnsupportedOperationException("Email verification disabled");
    }

    // ========================= HELPER METHODS =========================

    private User createUser(SignUpRequestDto dto) throws RoleNotFoundException {

        return new User(
                dto.getUserName(),
                dto.getEmail(),
                passwordEncoder.encode(dto.getPassword()),
                null,   // ❌ no verification code
                null,   // ❌ no expiry
                true,   // 🔥 ENABLE USER DIRECTLY
                determineRoles(dto.getRoles())
        );
    }

    private Set<Role> determineRoles(Set<String> roles) throws RoleNotFoundException {
        Set<Role> result = new HashSet<>();

        if (roles == null || roles.isEmpty()) {
            result.add(roleFactory.getInstance("user"));
        } else {
            for (String role : roles) {
                result.add(roleFactory.getInstance(role));
            }
        }

        return result;
    }
}