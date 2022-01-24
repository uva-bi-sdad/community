test_that("downloads and processes files", {
  dir <- "../../dataverse_test"
  if (grepl("R_LIBS", getwd(), fixed = TRUE)) dir.create(dir, FALSE, TRUE)
  if (!dir.exists(dir)) dir <- "../../../dataverse_test"
  skip_if_not(dir.exists(dir), "not downloading data")
  d <- download_dataverse_data(
    "doi:10.18130/V3/NAZO4B", dir,
    files = 11, server = "dataverse.lib.virginia.edu"
  )
  expect_true(file.exists(paste0(dir, "/dc_bl_abc_2021_address_block_counts.csv")))
  expect_identical(
    d,
    download_dataverse_data("doi:10.18130/V3/NAZO4B", dir, files = "dc_bl_abc_2021_address_block_counts")
  )
})
