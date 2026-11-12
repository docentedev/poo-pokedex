# Contributing to AutoFix EP2

## 1. Fork & Clone
1. Fork this repository on GitHub.
2. Clone the fork locally:
   ```bash
   git clone https://github.com/<your-username>/AutoFix_EP2_Base.git
   cd AutoFix_EP2_Base
   ```

## 2. Create a Feature Branch
Always create a new branch for every feature or bug‑fix. Name the branch in the format `feature/<short-name>` or `bugfix/<short-name>`.

```bash
git checkout -b feature/refresh-fxml
```

## 3. Install Dependencies
```bash
mvn clean install
```

## 4. Make a Pull Request
1. Commit your changes with a descriptive message.
2. Push to your fork and create a PR against `main`.

## 5. Code Style
- Follow the existing coding conventions.
- Java: 8‑space indents, braces on new line.
- Keep comments relevant.
- Add Javadoc to public API changes.

## 6. Testing
- Run the full test suite before pushing:
  ```bash
  mvn test
  ```
- Add new unit tests for any new logic.

## 7. Changelog
Update the changelog with a new entry: see the format below.

## 8. Closing
- Wait for CI to pass.
- Address any code‑review comments.
- Merge when approved.

Thank you for contributing! 🎉
