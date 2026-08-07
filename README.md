Name: Benson Chen GitHub user: bensonchen1919

Name: Gabe Diaz GitHub user: gabe-di

can communicate with Discord, text, socials

communication methods convenient to Benson: Discord, text, willing to learn other platforms if it isn't too annoying

What counts as "done" from Benson: I skimmed through the code for bugs and formatting. We should do our best to resolve issues with code, and if it is unable to be resolved by either of us make a note of it. Time able, the person who shall submit the part will be responsible for asking the professor about bugs and errors (as to avoid sending duplicate requests). Note from Benson: I work some days, should it be appropriate (most likely) I can work on the project before I head off to work. After I get back it is less likely I will be willing to provide aid. 'Note from Benson' Addendum: I'll try to let my group partner(s) of my shifts the week of. Thus far I have worked on most Mondays.

What's "done" from Gabe: The listed description from Benson is pretty fair and adequate for the completion of assignments. If there is a shift on my own end or if I have something going on, I can let the group know ahead of time.

Resolving Disagreements (Benson's proposal): If it is about project approaches like the code or whatever, we should discuss which one is the best to go forward with. If they seem equally good or we cannot agree, we can test them both empirically and then decide based on which one is more effective. If there are disagreements on the direction of the project (i.e. significant enough to change the final nature of the project), we should discuss which one to go with. If we still have trouble deciding, we should request input from the professor.

Resolving Disagreements (Gabe): Benson's proposal seems fair and sufficient with me.

Final insurance (Benson): In the event where a group member wishes to withdraw their agreement and participation (after previously agreeing and participating), the other group member(s) ought to be informed

Synopsis on Sprint 1 work (Benson): Made package.json, package-lock.json, and server.js, as well as a .gitignore to smoothen adding and pushing. Within my server.js I began to make the very rudimentary foundations of my code. The default path "/" should lead to what is the front page and where the player would start their adventure. For the moment I am using a simpler method wherein the message and link is contained within the code, however definitely will not be the way it will be scaled up, it just doesn't seem practical to make an ejs for a single response right now. I did however make an ejs for the starting page, though it is not currently in use.

Synopsis on Sprint 2 work (Benson 7/25/26): Made the ejs files that will be used in the get requests.
Currently, the ejs files looks something like so:
views
|-- partials
|   |-- job_assignment
|   |   |-- last_decision
|   |   |   |-- absolute.ejs
|   |   |   |-- attendents.ejs
|   |   |   |-- enforcement.ejs
|   |   |   |-- justice.ejs
|   |   |   |-- manufacturing.ejs
|   |   |   |-- mining.ejs
|   |   |   |-- research.ejs
|   |   |   |-- utopia.ejs
|   |   |-- improve.ejs
|   |   |-- order.ejs
|   |   |-- productivity.ejs
|   |   |-- serve.ejs
|   |-- agent.ejs
|-- start.ejs

## Sprint 3 Summary (8/2/2026, Gabe)

### Features Added

- Replaced JSON player storage with MongoDB using Mongoose.
- Added persistent player records with achievements and unlocked endings.
- Added mocked Jest tests for the player service (`npm test`).
- Added an HTMX progress map that updates without a full-page reload.
- Added responsive Tailwind CSS styling to the main pages.

### Running the Project

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```text
MONGODB_URI=mongodb://127.0.0.1:27018/ai-development-game
```

3. Create the MongoDB container (first time only):

```bash
docker run -d \
  --name sprint-project-mongo \
  -p 27018:27017 \
  -v sprint-project-mongo-data:/data/db \
  mongo:7
```

If the container already exists, start it with:

```bash
docker start sprint-project-mongo
```

4. Build the Tailwind stylesheet:

```bash
npm run build-css
```
4. Build the Tailwind stylesheet:

```bash
npm run build-css
```

5. Start the server:

```bash
npm start
```

6. Run tests:

```bash
npm test
```

### System Diagram

```
Browser
   |
EJS Views
   |
Routes
   |
Controllers
   |
Services <---- Jest Tests
   |
Repositories
   |
Mongoose
   |
MongoDB
```

##------------
minor change (08/06/20206)

Added more ejs files and changed the agent.ejs so that it hopefully matches with the standard set by start.ejs. I am not able to test the server at the moment due to changes elsewhere in the project but if it works I'll go ahead and edit other files to match.


## Sprint 4 Summary (08/07/2026, Gabe)

### Authentication

The project now uses `bcrypt` to hash passwords and `express-session` with `connect-mongo` to store sessions in MongoDB. Users can sign up at `/signup`, log in at `/login`, and log out with the visible logout button.

New accounts are always assigned the `member` role by the server. The application supports `member` and `admin` roles, and the signup form cannot select a role.

### Authorization

Player records now include an `ownerId`.

Protected player routes use `requireLogin` to verify that a user is authenticated. After the requested player is loaded, the player service checks whether the current user owns the player or has the `admin` role.

Testing confirmed:

- Player owner: allowed
- Different member: HTTP `403`
- Admin: allowed

### Accessibility Audit

The login, signup, and player forms use real `<label>` elements for their inputs. Interactive controls have visible keyboard focus styles, and logout can be used without a mouse.

The HTMX progress map moves focus to its updated heading after a dynamic swap so keyboard focus does not silently disappear.

Primary text, button, and hover colors were checked against the WCAG AA 4.5:1 contrast requirement.

### Health Check

`GET /health` is public and does not require authentication.

It returns:

```json
{ "status": "ok" }
```

### Updated System Diagram

```text
Browser
   |
   | Signup / Login / Logout
   | Full-page + HTMX requests
   v
EJS Views
   |
   v
Routes
   |
   +---- requireLogin
   |
   v
Controllers
   |
   v
Services <------------- Jest Tests
   |
   +---- Validation
   +---- Owner/Admin Authorization
   |
   v
Repositories
   |
   +---- User Repository
   +---- Player Repository
   |
   v
Mongoose Models
   |
   +---- User
   +---- Player
   |
   v
MongoDB
   |
   +---- Application Data
   +---- Session Store
```
