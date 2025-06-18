import { router, publicProcedure } from "../trpc"

const statsData = [
  { title: "New Clients", value: 50, color: "green" as "green" | "red", viewAllLink: "#" },
  { title: "No Logged Workout", value: 21274, color: "red" as "green" | "red", viewAllLink: "#" },
  { title: "Expiring Package", value: 301, color: "red" as "green" | "red", viewAllLink: "#" },
  { title: "Expiring Card", value: 3, color: "red" as "green" | "red", viewAllLink: "#" },
  { title: "Completed Assessment", value: 279, color: "green" as "green" | "red", viewAllLink: "#" },
  { title: "Birthday", value: 225, color: "green" as "green" | "red", viewAllLink: "#" },
  { title: "No Recent Visit", value: 21516, color: "red" as "green" | "red", viewAllLink: "#" },
  { title: "Calendar Plan Ending", value: 226, color: "red" as "green" | "red", viewAllLink: "#" },
  { title: "New Uploads", value: 53, color: "red" as "green" | "red", viewAllLink: "#" },
  { title: "New Messages", value: 1, color: "red" as "green" | "red", viewAllLink: "#" },
  { title: "Calendar Ending", value: 1263, color: "red" as "green" | "red", viewAllLink: "#" },
]

const recentClientsData = [
  { name: "Conner Foster", id: "1" },
  { name: "Brooklynn Cheong", id: "2" },
  { name: "Caiden Lamfrom", id: "3" },
]

const loggedWorkoutsData = [
  { name: "JJ Dutmers", date: "Aug 22, 4039", id: "1" },
  { name: "JJ Dutmers", date: "Aug 20, 4039", id: "2" },
  { name: "Mitch Kuglitsch", date: "Jun 02, 2025", id: "3" },
]

export const dashboardRouter = router({
  getStats: publicProcedure.query(async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return statsData
  }),
  getRecentClients: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return recentClientsData
  }),
  getLoggedWorkouts: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return loggedWorkoutsData
  }),
  getDashboardSummary: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return {
      dateRange: "May 22 - Jun 2", // Example data
    }
  }),
})

export type DashboardRouter = typeof dashboardRouter
