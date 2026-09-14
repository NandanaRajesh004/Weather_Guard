# Upgrade Plan: Weather Guard Backend (20260911032853)

- **Generated**: 2026-09-11 03:28:53
- **HEAD Branch**: N/A (project not in Git repository)
- **HEAD Commit ID**: N/A (project not in Git repository)

## Available Tools

**JDKs**
- JDK 21.0.10: C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot\bin (current project JDK, used by baseline)
- JDK 25.0.3: C:\Program Files\Java\jdk-25.0.3\bin (target JDK, required by steps 1-2)

**Build Tools**
- Maven 3.9.16: D:\apache-maven-3.9.16\bin (compatible with Java 25)

## Guidelines

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

## Options

- Working branch: appmod/java-upgrade-20260911032853
- Run tests before and after the upgrade: true

## Upgrade Goals

- **Java**: Upgrade from 21 to 25 LTS

## Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| --- | --- | --- | --- |
| Java | 21 | 25 | User requested latest LTS |
| Spring Boot | 4.0.8 | 4.0.8 | Already compatible with Java 25 |
| Maven | 3.9.16 | 3.9.16 | Compatible with Java 25 |
| mysql-connector-j | (managed by SB) | (managed by SB) | - |
| Lombok | (managed by SB) | (managed by SB) | - |

## Derived Upgrades

No additional upgrades required. Spring Boot 4.0.8 already provides full support for Java 25 LTS.

## Impact Analysis

### Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
| --- | --- | --- | --- | --- | --- |
| pom.xml | java.version property | 21 | upgrade | 25 | User requested Java 25 LTS upgrade |

### Source Code Changes

No source code changes required. The application contains no Java version-specific code, reflection usage of internal APIs, or platform-specific features that would be affected by the upgrade to Java 25.

### Configuration Changes

No configuration changes required. The `application.properties` file contains no Java version-specific settings.

### CI/CD Changes

No CI/CD files detected in the project (no Dockerfile, GitHub Actions, or Azure Pipelines).

### Risks & Warnings

**No risks identified.** This is a straightforward LTS-to-LTS upgrade within Spring Boot 4.0.8's supported range. All dependencies are modern and fully compatible with Java 25.

## Upgrade Steps

- **Step 1: Setup Environment**
  - **Rationale**: Verify that all required JDKs are available for the upgrade
  - **Changes to Make**: N/A (verification only)
  - **Verification**: JDK 25.0.3 is available at C:\Program Files\Java\jdk-25.0.3\bin

- **Step 2: Setup Baseline (Optional)**
  - **Rationale**: Run baseline tests with Java 21 to establish a passing test suite as acceptance criteria
  - **Changes to Make**: N/A (compile and test only)
  - **Verification**: Command: `mvn clean test-compile && mvn clean test` with JDK 21.0.10. Expected: All tests pass (100% pass rate or document baseline failure rate)

- **Step 3: Upgrade Java to 25 LTS**
  - **Rationale**: Update the java.version property in pom.xml to target Java 25
  - **Changes to Make**: Update pom.xml `<java.version>21</java.version>` → `<java.version>25</java.version>`
  - **Verification**: Command: `mvn clean test-compile` with JDK 25.0.3. Expected: Compilation SUCCESS

- **Step 4: Final Validation**
  - **Rationale**: Verify that all tests pass with Java 25 and that the upgrade is complete
  - **Changes to Make**: N/A (verification only)
  - **Verification**: Command: `mvn clean test` with JDK 25.0.3. Expected: All tests pass (100% pass rate). If failures occur, fix each one iteratively until 100% pass rate is achieved
