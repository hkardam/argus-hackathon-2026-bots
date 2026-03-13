package com.bots.hackathon.auth.services;

import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import java.util.Collections;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  private final UserRepository userRepository;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    OAuth2User oAuth2User = super.loadUser(userRequest);

    String email = oAuth2User.getAttribute("email");
    String name = oAuth2User.getAttribute("name");
    String providerId = oAuth2User.getAttribute("sub"); // Google uses 'sub' as unique identifier

    if (email == null) {
      throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
    }

    Optional<UserEntity> userOptional = userRepository.findByEmail(email);
    UserEntity user;

    if (userOptional.isPresent()) {
      user = userOptional.get();
      user.setName(name);
      user.setOauth2ProviderId(providerId);
      user = userRepository.save(user);
    } else {
      user =
          UserEntity.builder()
              .email(email)
              .name(name)
              .oauth2ProviderId(providerId)
              .role(Role.APPLICANT)
              .build();
      user = userRepository.save(user);
    }

    return new DefaultOAuth2User(
        Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())),
        oAuth2User.getAttributes(),
        "email"); // The name attribute key, using email
  }
}
