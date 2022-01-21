test_that("downloads and processes files", {
  dir <- tempdir()
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
