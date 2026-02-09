import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import YearMaster from "../year-master/YearMaster"; // Adjust the path based on your file structure
import {
  getYearMaster,
  saveAndUpdateYearMaster,
  deleteYearMaster,
} from "../../../services/masterServices/yearMasterService/yearMaster.service";

jest.mock("../../../services/masterServices/yearMasterService/yearMaster.service", () => ({
  getYearMaster: jest.fn(),
  saveAndUpdateYearMaster: jest.fn(),
  deleteYearMaster: jest.fn(),
}));

describe("YearMaster Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders YearMaster component", async () => {
    getYearMaster.mockResolvedValueOnce([]); // Mock an empty year list

    render(<YearMaster />);

    expect(screen.getByText("Year Master")).toBeInTheDocument();
    expect(screen.getByText("Add New Year:"));
    await waitFor(() => expect(getYearMaster).toHaveBeenCalled());
  });

  test("displays validation error for invalid input", () => {
    render(<YearMaster />);

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    expect(screen.getByText("Finance Year is required")).toBeInTheDocument();
  });

  test("saves a valid year and displays a success message", async () => {
    getYearMaster.mockResolvedValueOnce([]);
    saveAndUpdateYearMaster.mockResolvedValueOnce({
      status: 200,
      message: "Year saved successfully",
      res: { data: { YearInfo: { FinanceYear: "2024", ID: 1 } } },
    });

    render(<YearMaster />);

    const inputField = screen.getByPlaceholderText("Year");
    const saveButton = screen.getByText("Save");

    fireEvent.change(inputField, { target: { value: "2024" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Year saved successfully")).toBeInTheDocument();
      expect(screen.getByText("2024")).toBeInTheDocument();
    });
  });

  test("handles delete operation", async () => {
    getYearMaster.mockResolvedValueOnce([
      { FinanceYear: "2024", ID: 1 },
      { FinanceYear: "2023", ID: 2 },
    ]);
    deleteYearMaster.mockResolvedValueOnce({ message: "Years deleted successfully" });

    render(<YearMaster />);

    await waitFor(() => {
      expect(screen.getByText("2024")).toBeInTheDocument();
      expect(screen.getByText("2023")).toBeInTheDocument();
    });

    const checkbox2024 = screen.getAllByRole("checkbox")[1];
    const deleteButton = screen.getByText("Delete");

    fireEvent.click(checkbox2024);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Years deleted successfully")).toBeInTheDocument();
      expect(screen.queryByText("2024")).not.toBeInTheDocument();
    });
  });
});



