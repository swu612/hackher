import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ProjectsTable } from "src/sections/myproject/projects-table";
import { ProjectsSearch } from "src/sections/myproject/projects-search";
import { applyPagination } from "src/utils/apply-pagination";
import { ProjectsTemplate } from "../sections/myproject/projects-templates";

let data = [
  {
    id: "1",
    nameOfProject: "Project A",
    techStackUsed: "React, Node.js, MongoDB",
    dateCreated: "2023-01-15",
    dateLastModified: "2023-05-20",
    status: "In Progress",
    description: "this is a project ",
  },
  {
    id: "2",
    nameOfProject: "Project B",
    techStackUsed: "Angular, Express.js, PostgreSQL",
    dateCreated: "2023-02-28",
    dateLastModified: "2023-06-10",
    status: "Done",
    description: "this is a project ",
  },
  {
    id: "3",
    nameOfProject: "Project C",
    techStackUsed: "Vue.js, Django, MySQL",
    dateCreated: "2023-03-10",
    dateLastModified: "2023-07-05",
    status: "Done",
    description: "this is a project ",
  },
  {
    id: "4",
    nameOfProject: "Project D",
    techStackUsed: "React Native, Firebase",
    dateCreated: "2023-04-05",
    dateLastModified: "2023-08-15",
    status: "In Progress",
    description: "this is a project ",
  },
  {
    id: "5",
    nameOfProject: "Project E",
    techStackUsed: "Angular, Spring Boot, MongoDB",
    dateCreated: "2023-05-20",
    dateLastModified: "2023-09-25",
    status: "Archived",
    description: "this is a project ",
  },
  {
    id: "6",
    nameOfProject: "Project F",
    techStackUsed: "React, Django, PostgreSQL",
    dateCreated: "2023-06-08",
    dateLastModified: "2023-10-12",
    status: "Done",
    description: "this is a project ",
  },
  {
    id: "7",
    nameOfProject: "Project G",
    techStackUsed: "Vue.js, Node.js, MongoDB",
    dateCreated: "2023-07-14",
    dateLastModified: "2023-11-30",
    status: "Archived",
    description: "this is a project ",
  },
  {
    id: "8",
    nameOfProject: "Project H",
    techStackUsed: "React, Express.js, SQLite",
    dateCreated: "2023-08-30",
    dateLastModified: "2023-12-22",
    status: "In Progress",
    description: "this is a project ",
  },
  // Add more projects as needed
];

const useProjects = (page, rowsPerPage, searchQuery) => {
  // Filter projects based on the search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((project) =>
      project.nameOfProject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Apply pagination to filtered projects
  return useMemo(() => {
    return applyPagination(filteredProjects, page, rowsPerPage);
  }, [filteredProjects, page, rowsPerPage]);
};

const useProjectIds = (projects) => {
  return useMemo(() => {
    return projects.map((project) => project.id);
  }, [projects]);
};

const Page = () => {
  const [newProject, setNewProject] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const projects = useProjects(page, rowsPerPage, searchQuery);
  const projectIds = useProjectIds(projects);
  const projectSelection = useSelection(projectIds);

  const [buttonAdd, setButtonAdd] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Chess");
  const [difficultyLevel, setDifficultyLevel] = useState();
  const [frontEndFramework, setFrontEndFramework] = useState(); 
  const [backEndFramework, setBackEndFramework] = useState();
  const [projectDescription, setProjectDescription] = useState("This is an interactive chess game with a bot who controls the CPU's move");

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleSearchInputChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSearchKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter") {
        // Trigger filtering when Enter key is pressed
        setPage(0);
      }
    },
    [setPage]
  );

  const handleToggleModal = async () => {
    setNewProject(!setNewProject);
    event.preventDefault(); // Prevent default form submission behavior

    const title = projectTitle.split(" ").concat(projectDescription.split(" "));
    const concatenated_title = title.length > 1 ? title.join("+") : title[0];

    const levels = difficultyLevel.trim();

    const tech_stack = frontEndFramework.split(" ").concat(backEndFramework.split(" "));
    const concatenated_tech = tech_stack.length > 1 ? tech_stack.join("+") : tech_stack[0];

    const url = `http://127.0.0.1:8000/ai/gen_boilerplate/?input=${concatenated_title}/?level=${levels}/?tech_stack=${concatenated_tech}`

    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok, status: ' + response.status);
        const botData = await response.json();

        const responseObject = JSON.parse(botData.response); // Parsing the JSON string within the response property


  
        const newProject = {
          id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
          nameOfProject: projectTitle, // Assign based on context or fetched content
          techStackUsed: frontEndFramework +  " " + backEndFramework, // Manually assigned based on the description provided
          dateCreated: new Date().toISOString().slice(0, 10), // Use current date as creation date
          dateLastModified: new Date().toISOString().slice(0, 10), // Use current date or modify based on your logic
          status: "In Progress", // Assign based on context
          description: responseObject.response // Using the detailed description from the fetched response
        };

        // Add the new project to the data array
        data.push(newProject);
        console.log(data);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      // Update the loading message to show the error
    }

  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [prefillData, setPrefillData] = useState({
    title: "",
    description: "",
  });

  const handleOpenModalWithPrefill = (title, description) => {
    setPrefillData({ title, description });
    setNewProject(true); // Assuming setNewProject controls the modal's visibility
  };

  return (
      <>
      <Head>
        <title>My Projects</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">My Projects</Typography>
              </Stack>
            </Stack>

            <Grid container spacing={3}>
              <Grid
                item // Make sure to include the item prop for consistency
                xs={12}
                sm={6}
                lg={3}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }} // This centers the button
              >
                <Button
                  startIcon={
                    <SvgIcon
                      style={{ fontSize: "1.5rem" }} // Adjust the icon size as needed
                      fontSize="small"
                    >
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  style={{ height: "100%", width: "100%", maxWidth: "none", fontSize: "1.25rem" }} // Adjust width and height as needed
                  onClick={() => {setNewProject(true)
                    setButtonAdd(true)
                  }}
                >
                  Add
                </Button>
              </Grid>
              <Grid xs={12} sm={6} lg={3}
              onClick={() => setButtonAdd(false)}>
                <ProjectsTemplate
                  sx={{ height: "100%" }}
                  description="Simple"
                  title="TikTakToe"
                  onClick={() =>
                    handleOpenModalWithPrefill(
                      "TikTakToe",
                      "AI Coding Assistant, I plan to develop a Tic-Tac-Toe game that offers both a local two-player mode and a challenging single-player mode against an AI. The game should automatically check for win conditions or a draw and display the outcome. The AI should use simple strategy logic to make its moves, making the game engaging for the player. The design should also accommodate an intuitive interface for players to start new games and choose their mode of play. Can you outline the essential features and functions needed to create this game, ensuring a smooth and user-friendly experience?"
                    )
                  }
                />
              </Grid>
              <Grid xs={12} sm={6} lg={3} onClick={() => setButtonAdd(false)}>
                <ProjectsTemplate
                  sx={{ height: "100%" }}
                  description="Exciting"
                  title="Checkers"
                  onClick={() =>
                    handleOpenModalWithPrefill(
                      "Checkers",
                      "AI Coding Assistant, I'm interested in creating a checkers game that supports online multiplayer gameplay as well as a single-player mode against an AI. The game should include functionality to determine legal moves for checkers pieces, including regular moves and jump moves. It should also feature an AI opponent with basic strategic decision-making abilities. Additionally, the game needs to manage game sessions for online players, allowing them to join and leave games. Please provide an outline of the main components and logic required to build these functionalities, focusing on the player interaction and game state management."
                    )
                  }
                />
              </Grid>
              <Grid xs={12} sm={6} lg={3} onClick={() => setButtonAdd(false)}>
                <ProjectsTemplate
                  sx={{ height: "100%" }}
                  description="Classic"
                  title="Chess"
                  onClick={() =>
                    handleOpenModalWithPrefill(
                      "Chess",
                      "AI Coding Assistant, I am looking to develop a chess game that includes both an AI opponent and the ability for two players to compete online. Key features should include a function to check the legality of moves based on chess rules, an AI algorithm capable of deciding on moves based on the current board state, and online multiplayer capability that allows players to join a game session and make moves in real-time. The game should also track and display game history. Please generate a conceptual design and outline the core functions needed to implement these features, considering user experience and game flow."
                    )
                  }
                />
              </Grid>
            </Grid>
            <ProjectsSearch
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress}
            />
            <ProjectsTable
              count={data.length}
              items={projects}
              onDeselectAll={projectSelection.handleDeselectAll}
              onDeselectOne={projectSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={projectSelection.handleSelectAll}
              onSelectOne={projectSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={projectSelection.selected}
              // onUpdateStatus={handleStatusUpdate}
            />
          </Stack>
        </Container>
      </Box>

      <Modal
        open={newProject}
        onClose={handleToggleModal}
        aria-labelledby="add-project-title"
        aria-describedby="add-project-description"
      >
        <Box sx={modalStyle}>
          <Typography id="add-project-title" variant="h6" component="h2">
            Create A Project
          </Typography>
          <form noValidate autoComplete="off">
            <TextField
              margin="normal"
              required
              fullWidth
              id="projectTitle"
              label="Project Title"
              name="projectTitle"
              placeholder="Enter the project title"
              value={buttonAdd ? projectTitle : prefillData.title}
              onChange={(e) => setProjectTitle(e.target.value)}            
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="difficulty-level-label">Difficulty Level</InputLabel>
              <Select
                labelId="difficulty-level-label"
                id="difficultyLevel"
                label="Difficulty Level" // This prop ensures the label doesn't get covered
                name="difficultyLevel"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="front-end-framework-label">Front End Framework</InputLabel>
              <Select
                labelId="front-end-framework-label"
                id="frontEndFramework"
                label="Front End Framework" // Ensures the label is visible
                name="frontEndFramework"
                value={frontEndFramework}
                onChange={(e) => setFrontEndFramework(e.target.value)}
              >
                <MenuItem value="react">React</MenuItem>
                <MenuItem value="vue">Vue.js</MenuItem>
                <MenuItem value="angular">Angular</MenuItem>
                <MenuItem value="svelte">Svelte</MenuItem>
                <MenuItem value="nextjs">Next.js</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="back-end-framework-label">Back End Framework</InputLabel>
              <Select
                labelId="back-end-framework-label"
                id="Back-end-framework"
                label="Backend Framework" // Keeps the label visible after selection
                name="Back End Framework"
                value={backEndFramework}
                onChange={(e) => setBackEndFramework(e.target.value)}
              >
                <MenuItem value="django">Django (Python)</MenuItem>
                <MenuItem value="postgresql">PostgreSQL</MenuItem>
                <MenuItem value="flask">Flask (Python)</MenuItem>
                <MenuItem value="rubyonrails">Ruby on Rails</MenuItem>
                <MenuItem value=".net">.NET (C#)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="project description"
              label="Project Description"
              name="description"
              multiline
              rows={6} // Adjusted for shorter input
              placeholder="Provide a brief description of what you want your project to do."
              value={buttonAdd ? projectDescription: prefillData.description }
              onChange={(e) => setProjectDescription(e.target.value)}  
            />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => {setNewProject(!setNewProject);}}>
                Cancel
              </Button>
              <Link href={`/aiChat?id=${9}`} passHref>
              <Button variant="contained" onClick={handleToggleModal} sx={{ ml: 2 }}>
                Submit
              </Button>
              </Link>
            </Box>
          </form>
        </Box>
      </Modal>
      </>
    
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
