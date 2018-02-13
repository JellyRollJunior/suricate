/*
 * Copyright 2012-2018 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.suricate.monitoring.model.dto.user;

import io.suricate.monitoring.config.security.ConnectedUser;
import io.suricate.monitoring.model.dto.AbstractDto;
import io.suricate.monitoring.model.user.Role;
import io.suricate.monitoring.model.user.User;

import java.util.List;

/**
 * User dto used to manage user rights
 */
public class UserDto extends AbstractDto {

    /**
     * Data base id
     */
    private Long id;

    private String firstname;
    private String lastname;

    /**
     * User fullname
     */
    private String fullname;

    /**
     * Ldap username
     */
    private String username;

    /**
     * Ldap Mail
     */
    private String mail;

    private List<Role> roles;

    /**
     * Constructor of UserDto
     * @param user database user
     * @param connectedUser the current connected user
     */
    public UserDto(User user, ConnectedUser connectedUser) {
        this.id = user.getId();
        this.roles = user.getRoles();

        if (connectedUser != null) {
            this.firstname = connectedUser.getFirstname();
            this.lastname = connectedUser.getLastname();
            this.username = connectedUser.getUsername();
            this.fullname = connectedUser.getFullname();
            this.mail = connectedUser.getMail();
        }
    }

    /**
     * Constructor of UserDto
     * @param connectedUser the connected user
     */
    public UserDto(ConnectedUser connectedUser) {
        if (connectedUser != null) {
            this.fullname = connectedUser.getFullname();
            this.username = connectedUser.getUsername();
        }
    }

    /**
     * Constructor of UserDto using field username
     * @param username the id of the connected user
     */
    public UserDto(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }
    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }
}