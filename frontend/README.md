# StockScope Frontend

## Quick Start

### Prerequisites

- Node.js (v16 or higher) (Download this here: https://nodejs.org/en/download)
- npm (comes with Node.js)

### Installation (if haven't cloned repo yet)

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd StockScope
   ```

2. **Switch to the frontend branch:**

   If `git branch` doesn't show frontend as a local branch:

   **Method 1 (Recommended):**

   ```bash
   git checkout -b frontend origin/frontend
   ```

   **Method 2 (If Method 1 doesn't work):**

   ```bash
   git fetch origin
   git checkout frontend
   ```

   > ⚠️ **Note:** Don't try to checkout `remotes/origin/frontend` - it's read-only!

3. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **Start the development server:**

   ```bash
   npm start
   ```

6. **Open your browser:**

   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The app will automatically reload when you make changes

7. **Pushing code**

   - After committing the code you can push it with:

   ```bash
   git push -u origin <branch-name>
   ```

   - -u links the local branch to the remote branch, allowing for just `git push` in the future

8. **Managing Version Control**

- if you have local changes not yet pushed to the remote, and frontend was updated:

```bash

# fetch updates from remote
git fetch --all
#To pull these updates into your local repo
git pull origin/frontend
# update local branch with changes from frontend (only neccessary if frontend got updated)
git checkout <your-current-branch>
git merge origin/frontend
# you can now safely push your local commits to the remote branch
git push -u origin <your-current-branch>
```

-- if no frontend changes occured

```bash
git push -u origin <your-current-branch>
```

-- after using -u on a push for a branch, you can simply to do

```bash
git push
```

in the future

## Available Scripts

`npm start`: start running the development server (primary one to use)

`npm install`: install node modules

`rm -rf node_modules`: remove the node modules

`npm run refresh`: a script to remove and then reinstall node modules

> For all available scripts, check `package.json`

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Plotly.js** - Interactive charts and graphs
- **Axios** - HTTP client for API calls
- **Create React App** - Build tooling
- **CSS** - Styling

## 📁 Project Structure

```

frontend/
├── public/ # Static assets
├── src/ # React infrastructure
│ ├── components/ # React Components
│ ├── styles/ # CSS files (organized by component)

```

```

```
