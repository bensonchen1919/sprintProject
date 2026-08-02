import { jest } from "@jest/globals";

const mockCreatePlayerRecord = jest.fn();
const mockFindPlayerById = jest.fn();
const mockUpdatePlayerById = jest.fn();

jest.unstable_mockModule("../repositories/playerRepository.js", () => ({
  createPlayer: mockCreatePlayerRecord,
  findPlayerById: mockFindPlayerById,
  updatePlayerById: mockUpdatePlayerById
}));

const {
  createPlayer,
  getPlayerById,
  addEndingToPlayer
} = await import("../services/playerService.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createPlayer", () => {
  test("rejects a missing player name", async () => {
    await expect(createPlayer()).rejects.toThrow(
      "Player name is required."
    );

    expect(mockCreatePlayerRecord).not.toHaveBeenCalled();
  });

  test("rejects a whitespace-only player name", async () => {
    await expect(createPlayer("   ")).rejects.toThrow(
      "Player name is required."
    );

    expect(mockCreatePlayerRecord).not.toHaveBeenCalled();
  });

  test("rejects a one-character player name", async () => {
    await expect(createPlayer("A")).rejects.toThrow(
      "Player name must be at least 2 characters."
    );

    expect(mockCreatePlayerRecord).not.toHaveBeenCalled();
  });

  test("rejects a player name longer than 30 characters", async () => {
    const longName = "A".repeat(31);

    await expect(createPlayer(longName)).rejects.toThrow(
      "Player name must be 30 characters or fewer."
    );

    expect(mockCreatePlayerRecord).not.toHaveBeenCalled();
  });

  test("trims and creates a valid player", async () => {
    const savedPlayer = {
      _id: "player-1",
      name: "Beep",
      achievements: [],
      endingsReached: []
    };

    mockCreatePlayerRecord.mockResolvedValue(savedPlayer);

    await expect(createPlayer("  Beep  ")).resolves.toEqual(savedPlayer);

    expect(mockCreatePlayerRecord).toHaveBeenCalledWith({
      name: "Beep",
      achievements: [],
      endingsReached: []
    });
  });
});

describe("getPlayerById", () => {
  test("rejects a missing player ID", async () => {
    await expect(getPlayerById()).rejects.toThrow(
      "Player ID is required."
    );

    expect(mockFindPlayerById).not.toHaveBeenCalled();
  });

  test("rejects when the player does not exist", async () => {
    mockFindPlayerById.mockResolvedValue(null);

    await expect(getPlayerById("missing-id")).rejects.toThrow(
      "Player not found."
    );

    expect(mockFindPlayerById).toHaveBeenCalledWith("missing-id");
  });

  test("returns an existing player", async () => {
    const player = {
      _id: "player-1",
      name: "Beep",
      endingsReached: []
    };

    mockFindPlayerById.mockResolvedValue(player);

    await expect(getPlayerById("player-1")).resolves.toEqual(player);
  });
});

describe("addEndingToPlayer", () => {
  test("rejects a missing player ID", async () => {
    await expect(
      addEndingToPlayer(undefined, "4-1-1-1")
    ).rejects.toThrow("Player ID is required.");

    expect(mockFindPlayerById).not.toHaveBeenCalled();
    expect(mockUpdatePlayerById).not.toHaveBeenCalled();
  });

  test("rejects a missing ending ID", async () => {
    await expect(
      addEndingToPlayer("player-1", "   ")
    ).rejects.toThrow("Ending ID is required.");

    expect(mockFindPlayerById).not.toHaveBeenCalled();
    expect(mockUpdatePlayerById).not.toHaveBeenCalled();
  });

  test("adds a new ending to the player", async () => {
    const player = {
      _id: "player-1",
      name: "Beep",
      endingsReached: []
    };

    const updatedPlayer = {
      ...player,
      endingsReached: ["4-1-1-1"]
    };

    mockFindPlayerById.mockResolvedValue(player);
    mockUpdatePlayerById.mockResolvedValue(updatedPlayer);

    await expect(
      addEndingToPlayer("player-1", "4-1-1-1")
    ).resolves.toEqual(updatedPlayer);

    expect(mockUpdatePlayerById).toHaveBeenCalledWith("player-1", {
      endingsReached: ["4-1-1-1"]
    });
  });

  test("does not add the same ending twice", async () => {
    const player = {
      _id: "player-1",
      name: "Beep",
      endingsReached: ["4-1-1-1"]
    };

    mockFindPlayerById.mockResolvedValue(player);
    mockUpdatePlayerById.mockResolvedValue(player);

    await addEndingToPlayer("player-1", "4-1-1-1");

    expect(mockUpdatePlayerById).toHaveBeenCalledWith("player-1", {
      endingsReached: ["4-1-1-1"]
    });
  });
});