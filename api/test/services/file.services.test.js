/* eslint-disable */
let expect
let sinon;

(async () => {
  const chai = await import('chai')
  expect = chai.expect
  sinon = (await import('sinon')).default
})()

const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const fs = require('fs')
const crypto = require('crypto')
const { fetchFiles, fetchFilesData, revalidateFiles } = require('../../services/file.service')
const { getCachedData, setCachedData } = require('../../utils/cache')

describe('File Service Tests', function () {
  let mock, fsStub, cryptoStub

  before(async function () {
    const chai = await import('chai')
    expect = chai.expect
    sinon = (await import('sinon')).default
  })

  beforeEach(function () {
    sinon.restore()
    mock = new MockAdapter(axios)
    fsStub = sinon.stub(fs)
    cryptoStub = sinon.stub(crypto, 'createHash')
  })

  afterEach(function () {
    sinon.restore()
    mock.restore()
  })

  describe('fetchFiles', function () {
    it('should fetch file list from API', async function () {
      mock.onGet(`${process.env.EXTERNAL_API}/files`).reply(200, {
        files: ['file1.csv', 'file2.csv']
      })

      const files = await fetchFiles()
      expect(files).to.deep.equal(['file1.csv', 'file2.csv'])
      expect(mock.history.get.length).to.equal(1)
    })

    it('should throw an error if API call fails', async function () {
      mock.onGet(`${process.env.EXTERNAL_API}/files`).reply(500)

      try {
        await fetchFiles()
        throw new Error('This should not execute')
      } catch (error) {
        expect(error.message).to.include('Error fetching files: Request failed with status code 500')
      }
    })
  })

  describe('fetchFilesData', function () {
    it('should return cached data if available', async function () {
      const { setCachedData } = require('../../utils/cache')
      const mockCacheData = [
        { file: 'file1.csv', lines: [{ text: 'test', number: '1', hex: 'abcdef1234567890abcdef1234567890' }] }
      ]

      setCachedData('processedFiles', mockCacheData)

      const data = await fetchFilesData()

      expect(data).to.deep.equal(mockCacheData)

      expect(mock.history.get.length).to.equal(0)
    })

    it('should process new files if no cached data is available', async function () {
      sinon.stub(require('../../utils/cache'), 'getCachedData').returns(null)

      mock.onGet(`${process.env.EXTERNAL_API}/files`).reply(200, {
        files: ['file1.csv']
      })

      mock.onGet(`${process.env.EXTERNAL_API}/file/file1.csv`).reply(200, 'file content')

      const data = await fetchFilesData()

      expect(data).to.be.an('array')
      expect(data.length).to.equal(1)
    })

    it('should throw an error if fetchFiles fails', async function () {
      const { setCachedData } = require('../../utils/cache')
      sinon.stub(require('../../utils/cache'), 'getCachedData').returns(null)

      setCachedData('processedFiles', null)
      mock.onGet(`${process.env.EXTERNAL_API}/files`).reply(500, {
        message: 'Internal Server Error'
      })

      try {
        await fetchFilesData()
        throw new Error('This should not execute')
      } catch (error) {
        expect(error.message).to.include('Request failed with status code 500')
      }
      sinon.restore()
    })
  })
})
