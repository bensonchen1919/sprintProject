import { jest } from "@jest/globals";

const mockCreatePlayerRecord = jest.fn();
const mockFindPlayerById = jest.fn();
const mockUpdatePlayerById = jest.fn();

const playerId = "507f1f77bcf86cd799439011";
const missingPlayerId = "507f1f77bcf86cd799439012";

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

const ownerUser = {
  id: "owner-1",
  username: "owner",
  role: "member"
};

const otherUser = {
  id: "other-1",
  username: "other",
  role: "member"
};

const adminUser = {
  id: "admin-1",
  username: "admin",
  role: "admin"
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createPlayer", () => {
  test("rejects a missing owner ID", async () => {
    await expect(
      createPlayer("Beep")
    ).rejects.toThrow("Player owner is required.");

    expect(mockCreatePlayerRecord).not.toHaveBeenCalled();
  });

  test("rejects a missing player name", async () => {
    await expect(
      createPlayer(undefined, ownerUser.id)
    ).rejects.toThrow("Player name is required.");

    expect(mockCreatePlayerRecord).not.toHaveBeenCalled();
  });

  test("rejects a whitespace-only player name", async () => {
    await expect(
      createPlayer("   ", ownerUser.id)
    ).rejects.toThrow("Player name is required.");

    expect(mockCreatePlayerRecord).not.toHaveBeenCalled();
  });

  test("rejects a one-character player name", async () => {
    await expect(
      createPlayer("A", ownerUser.id)
    ).rejects.toThrow(
      "Player name must be at least 2 characters."
    );

    expect(mockCreatePlayerRecord).not.toHaveBeenCalled();
  });

  test("rejects a player name longer than 30 characters", async () => {
    await expect(
      createPlayer("A".repeat(31), ownerUser.id)
    ).rejects.toThrow(
      "Player name must be 30 characters or fewer."
    );

    expect(mockCreatePlayerRecord).not.toHaveBeenCalled();
  });

  test("trims and creates a valid owned player", async () => {
    const savedPlayer = {
      _id: playerId,
      ownerId: ownerUser.id,
      name: "Beep",
      achievements: [],
      endingsReached: []
    };

    mockCreatePlayerRecord.mockResolvedValue(savedPlayer);

    await expect(
      createPlayer("  Beep  ", ownerUser.id)
    ).resolves.toEqual(savedPlayer);

    expect(mockCreatePlayerRecord).toHaveBeenCalledWith({
      ownerId: ownerUser.id,
      name: "Beep",
      achievements: [],
      endingsReached: []
    });
  });
});

describe("getPlayerById", () => {
  test("rejects a missing player ID", async () => {
    await expect(
      getPlayerById()
    ).rejects.toThrow("Player ID is required.");

    expect(mockFindPlayerById).not.toHaveBeenCalled();
  });

  test("rejects an invalid player id", async () => {
    await expect(
      getPlayerById("not-a-real-id")
    ).rejects.toThrow("Player not found.");
  });

  test("rejects when the player does not exist", async () => {
    mockFindPlayerById.mockResolvedValue(null);

    await expect(
      getPlayerById(missingPlayerId)
    ).rejects.toThrow("Player not found.");

    expect(mockFindPlayerById).toHaveBeenCalledWith(missingPlayerId);
  });

  test("returns an existing player", async () => {
    const player = {
      _id: playerId,
      ownerId: ownerUser.id,
      name: "Beep",
      endingsReached: []
    };

    mockFindPlayerById.mockResolvedValue(player);

    await expect(
      getPlayerById(playerId)
    ).resolves.toEqual(player);
  });
});

describe("addEndingToPlayer", () => {
  test("rejects a missing player ID", async () => {
    await expect(
      addEndingToPlayer(undefined, "4-1-1-1", ownerUser)
    ).rejects.toThrow("Player ID is required.");

    expect(mockUpdatePlayerById).not.toHaveBeenCalled();
  });

  test("rejects a missing ending ID", async () => {
    await expect(
      addEndingToPlayer(playerId, "   ", ownerUser)
    ).rejects.toThrow("Ending ID is required.");

    expect(mockUpdatePlayerById).not.toHaveBeenCalled();
  });

  test("allows the owner to add a new ending", async () => {
    const player = {
      _id: playerId,
      ownerId: {
        toString: () => ownerUser.id
      },
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
      addEndingToPlayer(
        playerId,
        "4-1-1-1",
        ownerUser
      )
    ).resolves.toEqual(updatedPlayer);

    expect(mockUpdatePlayerById).toHaveBeenCalledWith(
      playerId,
      {
        endingsReached: ["4-1-1-1"]
      }
    );
  });

  test("returns a 403 error for a non-owner member", async () => {
    const player = {
      _id: playerId,
      ownerId: {
        toString: () => ownerUser.id
      },
      endingsReached: []
    };

    mockFindPlayerById.mockResolvedValue(player);

    try {
      await addEndingToPlayer(
        playerId,
        "4-1-1-1",
        otherUser
      );

      throw new Error("Expected authorization to fail.");
    } catch (error) {
      expect(error.message).toBe(
        "You are not allowed to modify this player."
      );
      expect(error.status).toBe(403);
    }

    expect(mockUpdatePlayerById).not.toHaveBeenCalled();
  });

  test("allows an admin to modify another user's player", async () => {
    const player = {
      _id: playerId,
      ownerId: {
        toString: () => ownerUser.id
      },
      endingsReached: []
    };

    const updatedPlayer = {
      ...player,
      endingsReached: ["4-1-1-1"]
    };

    mockFindPlayerById.mockResolvedValue(player);
    mockUpdatePlayerById.mockResolvedValue(updatedPlayer);

    await expect(
      addEndingToPlayer(
        playerId,
        "4-1-1-1",
        adminUser
      )
    ).resolves.toEqual(updatedPlayer);
  });

  test("does not add the same ending twice", async () => {
    const player = {
      _id: playerId,
      ownerId: {
        toString: () => ownerUser.id
      },
      endingsReached: ["4-1-1-1"]
    };

    mockFindPlayerById.mockResolvedValue(player);
    mockUpdatePlayerById.mockResolvedValue(player);

    await addEndingToPlayer(
      playerId,
      "4-1-1-1",
      ownerUser
    );

    expect(mockUpdatePlayerById).toHaveBeenCalledWith(
      playerId,
      {
        endingsReached: ["4-1-1-1"]
      }
    );
  });
});