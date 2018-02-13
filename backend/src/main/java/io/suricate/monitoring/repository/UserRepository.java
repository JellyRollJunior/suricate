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

package io.suricate.monitoring.repository;

import io.suricate.monitoring.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.annotation.Generated;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor {

	/**
	 * Method used to get user by username
	 * @param username the username
	 * @return the user object
	 */
    User findByUsername(String username);

	/**
	 * Methos used to get id by username
	 * @param username the user name to find
	 * @return the user id
	 */
	@Query("SELECT id FROM User WHERE username = :username")
    Long getIdByUsername(@Param("username") String username);

	/**
	 * Method used to get user by token
	 * @param token the user token
	 * @return the user object
	 */
	User findByToken(String token);

	/**
	 * Method used tofins all user by project id
	 * @param id the project id
	 * @return the list of user
	 */
	List<User> findByProjects_Id(Long id);
}